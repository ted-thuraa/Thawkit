export type LeadData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  leadData: {
    optedIn: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type OverallScore = {
  scoreTierId: string;
  scoreTierColor: string;
  score_percentage: string;
};

export type CategoryScore = {
  categoryId: string;
  categoryTitle: string;
  scoreTierId: string;
  score: string;
  score_potential: string;
  score_percentage: string;
  scoreTierColor: string;
  scoreTierName: string;
};

export type QuestionData = {
  id: string;
  title: string;
  QuizAnswers: {
    id: string;
    answer: string;
    option_id: string;
    score: number;
    time_spent: number;
  }[];
};

export type ResultPageData = {
  leadData: LeadData;
  overallScore: OverallScore;
  categoryScores: CategoryScore[];
  questionsData: QuestionData[];
  highestCategoryScore: CategoryScore;
  lowestCategoryScore: CategoryScore;
};

export const resultDataDummy: ResultPageData = {
  leadData: {
    id: "470abcc9-4e45-4db9-a83f-6792b5e500ae",
    email: "johnDoe@gmail.com",
    firstName: "John",
    lastName: "Doe",
    leadData: {
      optedIn: true,
    },
    createdAt: "2025-06-30T10:45:19.768Z",
    updatedAt: "2025-06-30T10:45:19.768Z",
  },
  overallScore: {
    scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
    scoreTierColor: "#40b43a",
    score_percentage: "58.00",
  },
  categoryScores: [
    {
      categoryId: "1668f6fa-7574-49a0-aadd-081810459b4e",
      categoryTitle: "marketing skill",
      scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
      score: "10",
      score_potential: "20",
      score_percentage: "50.00",
      scoreTierColor: "#40b43a",
      scoreTierName: "balanced",
    },
    {
      categoryId: "6397a3cb-bc86-4fe9-8cde-e44fef2abcb3",
      categoryTitle: "Marketing Strategy",
      scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
      score: "10",
      score_potential: "20",
      score_percentage: "50.00",
      scoreTierColor: "#40b43a",
      scoreTierName: "balanced",
    },
    {
      categoryId: "815c4053-1147-43c3-bd66-a60e0afc4d21",
      categoryTitle: "marketing direction",
      scoreTierId: "582b774d-7cbf-4fba-ad62-fc7615b66899",
      score: "10",
      score_potential: "10",
      score_percentage: "100.00",
      scoreTierColor: "#23810b",
      scoreTierName: "strongest",
    },
    {
      categoryId: "86bf5091-5758-48a8-8453-4d188352cd48",
      categoryTitle: "marketing angle",
      scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
      score: "10",
      score_potential: "20",
      score_percentage: "50.00",
      scoreTierColor: "#40b43a",
      scoreTierName: "balanced",
    },
    {
      categoryId: "f9069268-968d-45e6-bdad-46a3c8623242",
      categoryTitle: "Marketing content",
      scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
      score: "10",
      score_potential: "20",
      score_percentage: "50.00",
      scoreTierColor: "#40b43a",
      scoreTierName: "balanced",
    },
  ],
  questionsData: [
    {
      id: "084f652a-96a2-4cc5-85a4-911428b985b9",
      title: "Do you have any Marketing experience",
      QuizAnswers: [
        {
          id: "c4cfa7d5-1f63-4604-858d-028b05af7c60",
          answer: "Yes",
          option_id: "06d83445-f113-4060-9f2e-583ce2eb1250",
          score: 10,
          time_spent: 18,
        },
      ],
    },
    {
      id: "20dddab6-e496-4338-9a79-93f4e9850b4e",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "12250bdb-8a3f-424c-90e7-99d8f0849d1c",
          answer: "Yes",
          option_id: "bf8d16e3-e362-4b12-8280-4547e3e70c76",
          score: 5,
          time_spent: 2,
        },
      ],
    },
    {
      id: "4e2ca3f0-390e-4d35-9683-690fe67126d4",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "23cd2320-d464-4920-9683-409a5cb28fae",
          answer: "No",
          option_id: "d0ca406b-26a7-4ed3-90ed-e51e148ea5e2",
          score: 0,
          time_spent: 2,
        },
      ],
    },
    {
      id: "51b189e6-342e-490a-b75f-2aa79c80649d",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "0dfcf02e-fdaa-4a49-8cf3-7fa8ade8b593",
          answer: "Yes",
          option_id: "503c7528-4c69-49d1-90f5-c88689738c1c",
          score: 5,
          time_spent: 1,
        },
      ],
    },
    {
      id: "704aa9ec-82cb-42cc-95fe-4e13262061a4",
      title: "Do you engage your visitors",
      QuizAnswers: [
        {
          id: "f1c52a1f-e3ab-4fa7-a2fe-ead3458b2be8",
          answer: "No",
          option_id: "93ac2ea2-090e-44be-a857-902f8cc3dc32",
          score: 0,
          time_spent: 1,
        },
      ],
    },
    {
      id: "861a1131-2b51-4e91-8235-2dbd178a04fe",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "5393f2ed-3cce-457c-a191-6461c3b94a33",
          answer: "Yes",
          option_id: "455b6a5a-a26e-4a21-8e55-0d303d3b9793",
          score: 10,
          time_spent: 1,
        },
      ],
    },
    {
      id: "93117532-ee1f-42c4-963d-29860c77ece5",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "dd5c1cb8-9fb7-4d08-a161-3ce71bd3ea73",
          answer: "No",
          option_id: "bb4d8603-52c1-402e-b27d-1dc1e01c5f62",
          score: 0,
          time_spent: 1,
        },
      ],
    },
    {
      id: "b569975d-8e91-487a-9db1-19b816294475",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "86cd7a32-ec11-4c95-9e14-72a07dd9c304",
          answer: "Yes",
          option_id: "30ea6bd0-e74b-45cd-9cb9-645aa655c15a",
          score: 5,
          time_spent: 6,
        },
      ],
    },
    {
      id: "b8aaf7db-ff98-46ac-a41c-ec67b6148d71",
      title: "How many subs do you have in Youtube",
      QuizAnswers: [
        {
          id: "80aa9ef4-4c7f-42ee-acf2-191b9521e44b",
          answer: "No",
          option_id: "375c24db-3daf-4501-a048-134ec74d84ba",
          score: 0,
          time_spent: 1,
        },
      ],
    },
    {
      id: "d7acbfec-5feb-4f33-8663-e421efc1196b",
      title: "Click to edit Question",
      QuizAnswers: [
        {
          id: "1ad4e464-09d1-4bf5-922e-2f4275690a59",
          answer: "Yes",
          option_id: "da14963f-2137-400a-96c7-f5b7f685bc99",
          score: 10,
          time_spent: 1,
        },
      ],
    },
    {
      id: "d8e5f570-50c5-4546-aefb-1d3a43e6ddc5",
      title: "What's your conversion rate.",
      QuizAnswers: [
        {
          id: "f0d1a5da-c2de-49bd-ac21-31fdc81cd171",
          answer: "Yes",
          option_id: "6d8e9f06-b32e-4e5c-8525-93d26c5065c6",
          score: 10,
          time_spent: 2,
        },
      ],
    },
  ],
  highestCategoryScore: {
    categoryId: "815c4053-1147-43c3-bd66-a60e0afc4d21",
    categoryTitle: "marketing direction",
    scoreTierId: "582b774d-7cbf-4fba-ad62-fc7615b66899",
    score: "10",
    score_potential: "10",
    score_percentage: "100.00",
    scoreTierColor: "#23810b",
    scoreTierName: "strongest",
  },
  lowestCategoryScore: {
    categoryId: "1668f6fa-7574-49a0-aadd-081810459b4e",
    categoryTitle: "marketing skill",
    scoreTierId: "0907c15b-4dc8-421f-8054-270bedef8e6f",
    score: "10",
    score_potential: "20",
    score_percentage: "50.00",
    scoreTierColor: "#40b43a",
    scoreTierName: "balanced",
  },
};
