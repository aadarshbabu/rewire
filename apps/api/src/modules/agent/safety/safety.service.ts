import { Injectable, Logger } from '@nestjs/common';

export interface SafetyCheckResult {
  isCrisis: boolean;
  severity: 'none' | 'low' | 'medium' | 'critical';
  matchedTriggers: string[];
  recommendedAction: 'proceed' | 'warn' | 'escalate';
}

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name);

  // Critical crisis triggers requiring immediate intervention and escalation
  private readonly crisisPatterns: RegExp[] = [
    /\b(kill myself|commit suicide|end my life|want to die|take my own life)\b/i,
    /\b(cutting myself|slit my wrists|overdose|hanging myself)\b/i,
    /\b(no reason to live|better off dead|nobody would miss me)\b/i,
  ];

  // Self-diagnosis forbidden terms for post-generation checking
  private readonly diagnosisPatterns: RegExp[] = [
    /\b(you have|you are suffering from|i diagnose you with|you've got) (major depression|bipolar|schizophrenia|bpd|ptsd|ocd|autism)\b/i,
    /\b(my clinical diagnosis is|as your psychologist|as your doctor)\b/i,
  ];

  assessInputRisk(text: string): SafetyCheckResult {
    const matched: string[] = [];

    for (const pattern of this.crisisPatterns) {
      if (pattern.test(text)) {
        matched.push(pattern.source);
      }
    }

    if (matched.length > 0) {
      this.logger.warn(`Crisis triggers detected in user input: ${matched.join(', ')}`);
      return {
        isCrisis: true,
        severity: 'critical',
        matchedTriggers: matched,
        recommendedAction: 'escalate',
      };
    }

    return {
      isCrisis: false,
      severity: 'none',
      matchedTriggers: [],
      recommendedAction: 'proceed',
    };
  }

  validateGeneratedResponse(text: string): { isValid: boolean; sanitizedText: string } {
    let sanitized = text;
    let isValid = true;

    for (const pattern of this.diagnosisPatterns) {
      if (pattern.test(text)) {
        this.logger.warn(`Response safety violation: generated output contains clinical diagnosis pattern: ${pattern.source}`);
        isValid = false;
        // Append a clear clinical disclaimer
        sanitized = `${text}\n\n*(Reminder: I am an AI companion and cannot provide official psychiatric diagnoses. Please speak to a qualified healthcare provider for clinical assessments.)*`;
      }
    }

    return { isValid, sanitizedText: sanitized };
  }
}
