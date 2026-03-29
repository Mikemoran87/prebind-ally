import { useNavigate } from "react-router-dom";
import { Check, Upload, Brain, FileCheck, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  description: string;
  icon: typeof Check;
  status: "complete" | "current" | "upcoming";
}

interface DealWorkflowProps {
  dealId: string;
  dealDbId: string;
  hasDocuments: boolean;
  hasAnalysis: boolean;
  hasSignOff: boolean;
  onAnalyse: () => void;
  isAnalysing: boolean;
}

export function DealWorkflow({ dealId, dealDbId, hasDocuments, hasAnalysis, hasSignOff, onAnalyse, isAnalysing }: DealWorkflowProps) {
  const navigate = useNavigate();

  const steps: Step[] = [
    {
      id: 1,
      label: "Deal Created",
      description: dealId,
      icon: PlusCircle,
      status: "complete",
    },
    {
      id: 2,
      label: "Upload Documents",
      description: hasDocuments ? "Documents uploaded" : "Add broker submission & DD report",
      icon: Upload,
      status: hasDocuments ? "complete" : "current",
    },
    {
      id: 3,
      label: "AI Analysis",
      description: hasAnalysis ? "Risks identified" : "Run AI risk analysis",
      icon: Brain,
      status: hasAnalysis ? "complete" : hasDocuments ? "current" : "upcoming",
    },
    {
      id: 4,
      label: "Review & Sign Off",
      description: hasSignOff ? "Governance complete" : "Review risks & sign off",
      icon: FileCheck,
      status: hasSignOff ? "complete" : hasAnalysis ? "current" : "upcoming",
    },
  ];

  const currentStep = steps.find(s => s.status === "current");

  return (
    <div className="mb-6 p-5 rounded-xl border border-border/50 bg-card/50">
      {/* Steps */}
      <div className="flex items-start gap-0">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {!isLast && (
                <div className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5 z-0",
                  step.status === "complete" ? "bg-primary" : "bg-border"
                )} />
              )}

              {/* Circle */}
              <div className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                step.status === "complete" && "border-primary bg-primary text-primary-foreground",
                step.status === "current" && "border-primary bg-background text-primary",
                step.status === "upcoming" && "border-border bg-background text-muted-foreground"
              )}>
                {step.status === "complete" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p className={cn(
                  "text-xs font-semibold",
                  step.status === "complete" && "text-primary",
                  step.status === "current" && "text-foreground",
                  step.status === "upcoming" && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current step action */}
      {currentStep && (
        <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Next: {currentStep.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{currentStep.description}</p>
          </div>

          {currentStep.id === 2 && (
            <Button
              onClick={() => navigate(`/dashboard/upload?dealId=${dealDbId}&dealRef=${dealId}`)}
              className="shrink-0 gap-2 bg-gradient-to-r from-primary to-cyan-500"
            >
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          )}

          {currentStep.id === 3 && (
            <Button
              onClick={onAnalyse}
              disabled={isAnalysing}
              className="shrink-0 gap-2 bg-gradient-to-r from-primary to-cyan-500"
            >
              <Brain className={cn("h-4 w-4", isAnalysing && "animate-pulse")} />
              {isAnalysing ? "Analysing (30–60s)..." : "Analyse Documents"}
            </Button>
          )}

          {currentStep.id === 4 && (
            <Button
              onClick={() => navigate("/audit-trail")}
              className="shrink-0 gap-2 bg-gradient-to-r from-primary to-cyan-500"
            >
              <FileCheck className="h-4 w-4" />
              Review & Sign Off
            </Button>
          )}
        </div>
      )}

      {!currentStep && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-500">All steps complete — deal governance is done.</p>
        </div>
      )}
    </div>
  );
}
