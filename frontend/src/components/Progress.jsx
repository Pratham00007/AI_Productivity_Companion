import { useEffect, useState } from "react";

function Progress() {

  const [step, setStep] =
    useState(0);

  const steps = [
    "📩 Reading Emails",
    "🤖 Gemini Analysis",
    "📝 Creating Tasks",
    "📅 Creating Calendar Events",
    "✅ Finalizing"
  ];

  useEffect(() => {

    const timer =
      setInterval(() => {

        setStep((prev) => {

          if (
            prev <
            steps.length - 1
          ) {
            return prev + 1;
          }

          return prev;
        });

      }, 2000);

    return () =>
      clearInterval(timer);

  }, []);

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h3>Scanning...</h3>

      {steps.map(
        (item, index) => (

          <p
            key={index}
            style={{
              color:
                index <= step
                  ? "green"
                  : "gray"
            }}
          >
            {item}
          </p>

        )
      )}

    </div>
  );
}

export default Progress;