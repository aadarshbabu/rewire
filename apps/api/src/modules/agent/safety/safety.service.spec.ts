import { SafetyService } from './safety.service';

describe('SafetyService', () => {
  let service: SafetyService;

  beforeEach(() => {
    service = new SafetyService();
  });

  it('should detect crisis triggers and recommend escalation', () => {
    const result = service.assessInputRisk('I want to end my life, please help');
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.recommendedAction).toBe('escalate');
  });

  it('should allow benign input to proceed without crisis trigger', () => {
    const result = service.assessInputRisk('I have been feeling a bit stressed at work today.');
    expect(result.isCrisis).toBe(false);
    expect(result.severity).toBe('none');
    expect(result.recommendedAction).toBe('proceed');
  });

  it('should sanitize generated text if it contains forbidden clinical diagnosis pattern', () => {
    const invalidText = 'Based on your message, you have major depression.';
    const validation = service.validateGeneratedResponse(invalidText);
    expect(validation.isValid).toBe(false);
    expect(validation.sanitizedText).toContain('Reminder: I am an AI companion');
  });

  it('should pass through safe generated responses', () => {
    const safeText = 'It sounds like things have been heavy for you lately. Have you tried taking a gentle walk?';
    const validation = service.validateGeneratedResponse(safeText);
    expect(validation.isValid).toBe(true);
    expect(validation.sanitizedText).toBe(safeText);
  });
});
