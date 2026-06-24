const sampleQuestionSchema = [
  {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Quiz Question Schema",
    description: "Schema for a single quiz question",
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the question (UUID recommended)",
      },
      title: {
        type: "string",
        description: "The main title or text of the question",
      },
      description: {
        type: "string",
        description:
          "Optional additional description or context for the question",
      },
      type: {
        type: "string",
        description:
          "The type of question (e.g., 'single-choice', 'multiple-choice', 'scale', 'numeric-input', 'custom')",
      },
      answerOptions: {
        type: "array",
        description:
          "Array of possible answer options for multiple/single choice questions",
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              description: "The display text for the answer option",
            },
            value: {
              type: "string",
              description:
                "The internal value associated with the answer option",
            },
            isCorrect: {
              type: "boolean",
              description:
                "Indicates if this option is a correct answer (for scoring)",
            },
            metadata: {
              type: "object",
              description:
                "Optional metadata for the answer option (e.g., points, feedback)",
              additionalProperties: true,
            },
          },
          required: ["label", "value"],
        },
      },
      media: {
        type: "array",
        description: "Array of media attachments for the question",
        items: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the media file",
            },
            altText: {
              type: "string",
              description:
                "Alternative text for accessibility (e.g., image description)",
            },
            mediaType: {
              type: "string",
              enum: ["image", "video", "audio"],
              description: "Type of media",
            },
          },
          required: ["url", "mediaType"],
        },
      },
      categories: {
        type: "array",
        description: "Array of category IDs this question belongs to",
        items: {
          type: "string",
        },
      },
      score: {
        type: "number",
        description:
          "Points awarded for correctly answering this question (if not category-based)",
      },
      branchingLogic: {
        type: "array",
        description:
          "Conditional logic for branching to other questions or pages",
        items: {
          type: "object",
          properties: {
            condition: {
              type: "object",
              description:
                'Condition to evaluate (e.g., { "questionId": "q1", "answerValue": "optionA" })',
              additionalProperties: true,
            },
            destination: {
              type: "object",
              description: "Destination if condition is met",
              properties: {
                questionId: {
                  type: "string",
                  description: "ID of the question to jump to",
                },
                pageId: {
                  type: "string",
                  description: "ID of the page to jump to",
                },
              },
              oneOf: [{ required: ["questionId"] }, { required: ["pageId"] }],
            },
          },
          required: ["condition", "destination"],
        },
      },
      questionSpecifics: {
        type: "object",
        description: "Properties specific to different question types",
        oneOf: [
          {
            properties: {
              type: { const: "multiple-choice" },
              minSelections: {
                type: "integer",
                description: "Minimum number of options to select",
              },
              maxSelections: {
                type: "integer",
                description: "Maximum number of options to select",
              },
            },
            required: ["type"],
          },
          {
            properties: {
              type: { const: "single-choice" },
            },
            required: ["type"],
          },
          {
            properties: {
              type: { const: "scale" },
              min: {
                type: "number",
                description: "Minimum value for the scale",
              },
              max: {
                type: "number",
                description: "Maximum value for the scale",
              },
              step: { type: "number", description: "Step value for the scale" },
            },
            required: ["type", "min", "max"],
          },
          {
            properties: {
              type: { const: "numeric-input" },
              minValue: {
                type: "number",
                description: "Minimum allowed numeric input value",
              },
              maxValue: {
                type: "number",
                description: "Maximum allowed numeric input value",
              },
            },
            required: ["type"],
          },
          {
            properties: {
              type: { const: "custom" },
              customData: {
                type: "object",
                description: "Arbitrary data for custom question types",
                additionalProperties: true,
              },
            },
            required: ["type", "customData"],
          },
        ],
      },
    },
    required: ["id", "title", "type"],
  },
];

const realDataSample = [
  {
    id: "q1",
    title:
      "Which of the following are programming languages? (Select all that apply)",
    description:
      "This question tests your knowledge of common programming languages.",
    type: "multiple-choice",
    answerOptions: [
      { label: "Python", value: "python", isCorrect: true },
      { label: "HTML", value: "html", isCorrect: false },
      { label: "JavaScript", value: "javascript", isCorrect: true },
      { label: "CSS", value: "css", isCorrect: false },
    ],
    media: [
      {
        url: "https://example.com/images/programming_languages.png",
        altText: "Illustration of various programming language logos",
        mediaType: "image",
      },
    ],
    categories: ["technology", "programming"],
    questionSpecifics: {
      type: "multiple-choice",
      minSelections: 1,
      maxSelections: 2,
    },
  },
  {
    id: "q2",
    title: "What is the capital of France?",
    type: "single-choice",
    answerOptions: [
      { label: "Berlin", value: "berlin" },
      { label: "Madrid", value: "madrid" },
      { label: "Paris", value: "paris", isCorrect: true },
      { label: "Rome", value: "rome" },
    ],
    categories: ["geography"],
    branchingLogic: [
      {
        condition: { questionId: "q2", answerValue: "paris" },
        destination: { questionId: "q3" },
      },
      {
        condition: { questionId: "q2", answerValue: "berlin" },
        destination: { pageId: "incorrect_answer_page" },
      },
    ],
    questionSpecifics: {
      type: "single-choice",
    },
  },
  {
    id: "q3",
    title: "On a scale of 1 to 10, how much do you enjoy learning new things?",
    type: "scale",
    categories: ["psychology"],
    questionSpecifics: {
      type: "scale",
      min: 1,
      max: 10,
      step: 1,
    },
  },
  {
    id: "q4",
    title: "Enter the year the first iPhone was released:",
    type: "numeric-input",
    categories: ["technology", "history"],
    questionSpecifics: {
      type: "numeric-input",
      minValue: 1990,
      maxValue: 2025,
    },
  },
];
