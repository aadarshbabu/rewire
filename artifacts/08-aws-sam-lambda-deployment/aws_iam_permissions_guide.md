# AWS IAM Permissions & CloudFormation Troubleshooting Guide

This step-by-step guide explains how to diagnose, check, fix, and verify AWS IAM permissions when deploying serverless applications with **AWS SAM** and **CloudFormation**.

---

## 1. Step 1: Identify Which IAM Identity You Are Using

When you run `sam deploy` or `aws` CLI commands, AWS determines your permissions based on the active credentials (configured via `aws configure` or environment variables).

### Command:
```bash
aws sts get-caller-identity
```

### Output Example:
```json
{
    "UserId": "AIDAZD62HAR6WCZUDGQTA",
    "Account": "626985993341",
    "Arn": "arn:aws:iam::626985993341:user/aws-cli"
}
```
* **Key takeaway**: The ARN tells you the exact IAM entity: here, user `aws-cli` in account `626985993341`.

---

## 2. Step 2: Inspect Currently Attached Policies

An IAM user can have two types of policies:
1. **Managed Policies** (AWS-managed or customer-managed policies attached to the user).
2. **Inline Policies** (custom JSON policies embedded directly inside the user).

### Check Managed Policies:
```bash
aws iam list-attached-user-policies --user-name aws-cli
```
* Shows all attached AWS managed policies (e.g. `AWSLambda_FullAccess`, `AmazonS3FullAccess`).

### Check Inline Policies:
```bash
aws iam list-user-policies --user-name aws-cli
```

### Inspect the Content of an Inline Policy:
```bash
aws iam get-user-policy --user-name aws-cli --policy-name <policy-name>
```

#### Why our deployment failed:
We inspected the existing `sqs-policy` inline policy:
```json
{
  "Action": [
    "sqs:SendMessage",
    "sqs:ReceiveMessage",
    "sqs:DeleteMessage",
    "sqs:GetQueueAttributes"
  ],
  "Resource": "*"
}
```
* Notice what was missing: `sqs:CreateQueue`, `sqs:SetQueueAttributes`, and `sqs:TagQueue`. CloudFormation could not provision `AiJobDeadLetterQueue`.

---

## 3. Step 3: Understand AWS IAM Quotas (The 10-Policy Limit)

AWS IAM enforces a default service quota:
> [!WARNING]
> **Managed Policies Per User Limit: 10**
> An IAM user cannot have more than **10 managed policies** attached directly. Attempting to attach an 11th will fail with:
> `An error occurred (LimitExceeded): Cannot exceed quota for PoliciesPerUser: 10`

### How to overcome this limit:
1. **Option A: Use Inline Policies (`aws iam put-user-policy`)** — Inline policies do **not** count towards the 10-managed-policy quota.
2. **Option B: Use IAM Groups** — Put the user in an IAM Group (e.g., `Deployers`) and attach policies to the group.
3. **Option C: Recommended Production Best Practice** — Use a dedicated **CloudFormation Deployment Role** (see Section 6).

---

## 4. Step 4: Grant the Missing Permissions

### A. Granting SQS Permissions (Managed Policy)
To allow creating and managing SQS and Dead-Letter Queues:
```bash
aws iam attach-user-policy \
  --user-name aws-cli \
  --policy-arn arn:aws:iam::aws:policy/AmazonSQSFullAccess
```

### B. Granting CloudWatch Logs Permissions (Inline Policy)
Because the managed policy limit of 10 was reached, we created an inline policy for CloudWatch Logs so CloudFormation can manage `/aws/lambda/rewire-ai-worker-production`:

```bash
aws iam put-user-policy \
  --user-name aws-cli \
  --policy-name cloudwatch-logs-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["logs:*"],
        "Resource": "*"
      }
    ]
  }'
```

---

## 5. Step 5: Handling CloudFormation `ROLLBACK_COMPLETE` State

When a CloudFormation stack creation fails on its very first attempt, CloudFormation rolls back all resources and places the stack into **`ROLLBACK_COMPLETE`**.

> [!IMPORTANT]
> **Why CloudFormation blocks re-deploying a `ROLLBACK_COMPLETE` stack:**
> A stack in `ROLLBACK_COMPLETE` contains 0 resources, but the **stack name is locked**. CloudFormation cannot update or retry a stack that failed during initial creation. Running `sam deploy` will report:
> `Stack [rewire-ai-stack] is in ROLLBACK_COMPLETE state and can not be updated.`

### How to check stack status:
```bash
aws cloudformation describe-stacks --stack-name rewire-ai-stack --region ap-south-1
```

### How to clean it up:
Delete the failed placeholder stack (it has 0 resources, so no live infrastructure is harmed):
```bash
aws cloudformation delete-stack --stack-name rewire-ai-stack --region ap-south-1
```

Verify it is gone:
```bash
aws cloudformation describe-stacks --stack-name rewire-ai-stack --region ap-south-1
```
Once it reports `Stack with id rewire-ai-stack does not exist`, you are free to run `sam deploy`.

---

## 6. Required Permissions Matrix for This Stack

To deploy the Rewire AI Worker stack, your AWS identity or CloudFormation execution role requires permissions for:

| Resource in `template.yaml` | AWS Service | Actions Required |
| :--- | :--- | :--- |
| `AiJobQueue`, `AiJobDeadLetterQueue` | **SQS** | `sqs:CreateQueue`, `sqs:DeleteQueue`, `sqs:GetQueueAttributes`, `sqs:SetQueueAttributes`, `sqs:TagQueue` |
| `AiWorkerLogGroup` | **CloudWatch Logs** | `logs:CreateLogGroup`, `logs:DeleteLogGroup`, `logs:PutRetentionPolicy`, `logs:DescribeLogGroups` |
| `AiWorkerFunction` | **Lambda** | `lambda:CreateFunction`, `lambda:DeleteFunction`, `lambda:UpdateFunctionCode`, `lambda:UpdateFunctionConfiguration`, `lambda:TagResource` |
| Execution Role for Worker | **IAM** | `iam:CreateRole`, `iam:DeleteRole`, `iam:AttachRolePolicy`, `iam:DetachRolePolicy`, `iam:PassRole` |
| SQS Event Source Mapping | **Lambda** | `lambda:CreateEventSourceMapping`, `lambda:DeleteEventSourceMapping`, `lambda:GetEventSourceMapping` |
| SAM Artifact Bucket | **S3** | `s3:CreateBucket`, `s3:PutObject`, `s3:GetObject` |
| Stack Orchestration | **CloudFormation** | `cloudformation:CreateChangeSet`, `cloudformation:ExecuteChangeSet`, `cloudformation:DescribeStacks` |

---

## 7. Troubleshooting Quick Reference Commands

```bash
# 1. Who am I?
aws sts get-caller-identity

# 2. What managed policies do I have?
aws iam list-attached-user-policies --user-name <username>

# 3. What inline policies do I have?
aws iam list-user-policies --user-name <username>

# 4. View a specific inline policy
aws iam get-user-policy --user-name <username> --policy-name <policy-name>

# 5. Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name <stack-name> --region ap-south-1

# 6. Delete a stuck / rolled-back stack
aws cloudformation delete-stack --stack-name <stack-name> --region ap-south-1
```
