import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StepWizard = ({
  steps = [],
  onComplete,
  className = "",
  showProgress = true,
  allowBackNavigation = true,
  validateStep = null,
  theme = "light",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [direction, setDirection] = useState(1); // 1 для вперед, -1 для назад

  // Стабилизируем функции с помощью useCallback
  const updateStepData = useCallback((stepIndex, data) => {
    setStepData((prev) => ({
      ...prev,
      [stepIndex]: { ...prev[stepIndex], ...data },
    }));
  }, []);

  const nextStep = useCallback(async () => {
    const currentStepData = stepData[currentStep] || {};

    // Валидация если нужна
    if (validateStep) {
      const isValid = await validateStep(currentStep, currentStepData);
      if (!isValid) return;
    }

    // Добавляем шаг в завершенные
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Завершение всех шагов
      if (onComplete) {
        onComplete(stepData);
      }
    }
  }, [currentStep, stepData, validateStep, steps.length, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0 && allowBackNavigation) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, allowBackNavigation]);

  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setDirection(stepIndex > currentStep ? 1 : -1);
        setCurrentStep(stepIndex);
      }
    },
    [currentStep, steps.length]
  );

  const currentStepConfig = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Анимации для переходов между шагами
  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${progress}%`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <div
      className={`step-wizard ${theme} ${className}`}
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          theme === "dark" ? "var(--background-color)" : "#ffffff",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Progress Bar */}
      {showProgress && (
        <motion.div
          className="wizard-header"
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid var(--border-color)",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--text-color)",
              }}
            >
              {currentStepConfig?.title || `Шаг ${currentStep + 1}`}
            </h2>
            <span
              style={{
                fontSize: "14px",
                color: "var(--secondary-text-color)",
                fontWeight: "500",
              }}
            >
              {currentStep + 1} из {steps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "rgba(0, 122, 255, 0.1)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #007AFF, #00D4FF)",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
              }}
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Step Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  opacity: index <= currentStep ? 1 : 0.5,
                }}
                whileHover={index <= currentStep ? { scale: 1.05 } : {}}
                onClick={() => index <= currentStep && goToStep(index)}
              >
                <motion.div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    border: "2px solid",
                    borderColor: completedSteps.has(index)
                      ? "#00D4FF"
                      : index === currentStep
                      ? "#007AFF"
                      : "var(--border-color)",
                    backgroundColor: completedSteps.has(index)
                      ? "#00D4FF"
                      : index === currentStep
                      ? "#007AFF"
                      : "transparent",
                    color:
                      completedSteps.has(index) || index === currentStep
                        ? "#ffffff"
                        : "var(--text-color)",
                  }}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                    boxShadow:
                      index === currentStep
                        ? "0 4px 12px rgba(0, 122, 255, 0.3)"
                        : "none",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {completedSteps.has(index) ? "✓" : index + 1}
                </motion.div>
                <span
                  style={{
                    fontSize: "12px",
                    color:
                      index <= currentStep
                        ? "var(--text-color)"
                        : "var(--secondary-text-color)",
                    textAlign: "center",
                    maxWidth: "60px",
                    lineHeight: "1.2",
                  }}
                >
                  {step.shortTitle || step.title}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step Content */}
      <div
        style={{
          flex: 1,
          height: "100%",
          position: "relative",
          overflowY: "auto", // изменено с hidden на auto для прокрутки
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: "32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Step Description */}
            {currentStepConfig?.description && (
              <motion.p
                style={{
                  fontSize: "16px",
                  color: "var(--secondary-text-color)",
                  lineHeight: "1.5",
                  marginBottom: "32px",
                  textAlign: "center",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentStepConfig.description}
              </motion.p>
            )}

            {/* Step Content */}
            <motion.div
              style={{ flex: 1 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentStepConfig?.component &&
                React.cloneElement(currentStepConfig.component, {
                  data: stepData[currentStep] || {},
                  updateData: (newData) => updateStepData(currentStep, newData),
                  onNext: nextStep,
                  onPrev: prevStep,
                })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        className="wizard-footer"
        style={{
          padding: "24px 32px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            border: "2px solid var(--border-color)",
            background: "transparent",
            color: "var(--text-color)",
            fontSize: "16px",
            fontWeight: "500",
            cursor:
              currentStep > 0 && allowBackNavigation
                ? "pointer"
                : "not-allowed",
            opacity: currentStep > 0 && allowBackNavigation ? 1 : 0.5,
          }}
          whileHover={
            currentStep > 0 && allowBackNavigation
              ? {
                  borderColor: "var(--primary-color)",
                  transform: "translateY(-1px)",
                }
              : {}
          }
          whileTap={
            currentStep > 0 && allowBackNavigation ? { scale: 0.98 } : {}
          }
          onClick={prevStep}
          disabled={currentStep === 0 || !allowBackNavigation}
        >
          ← Назад
        </motion.button>

        <motion.button
          style={{
            padding: "12px 32px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #007AFF, #00D4FF)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)",
          }}
          whileHover={{
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0, 122, 255, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
        >
          {currentStep === steps.length - 1 ? "Завершить" : "Далее →"}
        </motion.button>
      </motion.div>

      {/* Декоративные элементы */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          right: "-100px",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default StepWizard;