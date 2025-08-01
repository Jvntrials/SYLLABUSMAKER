import { GoogleGenAI, Type } from "@google/genai";
import type { SyllabusData, ParsedSyllabusResponse } from '../types';

const syllabusSchema = {
  type: Type.OBJECT,
  properties: {
    pilos: {
      type: Type.ARRAY,
      description: "A list of 3-5 Program Intended Learning Outcomes (PILOs). These are broad statements about what students will be able to do upon completion of the program.",
      items: { type: Type.STRING }
    },
    syllabus: {
      type: Type.ARRAY,
      description: "The detailed weekly syllabus breakdown.",
      items: {
        type: Type.OBJECT,
        required: ["week", "content", "ilo", "ats", "tlas", "synchronous", "asynchronous", "ltsm", "outputMaterials"],
        properties: {
          week: {
            type: Type.INTEGER,
            description: "The week number."
          },
          content: {
            type: Type.STRING,
            description: "A brief description of the topics covered in this week."
          },
          ilo: {
            type: Type.STRING,
            description: "Specific Intended Learning Outcomes for this week's content."
          },
          ats: {
            type: Type.STRING,
            description: "Assessment Tasks for the week (e.g., Quiz, Assignment, Project Milestone)."
          },
          tlas: {
            type: Type.STRING,
            description: "Suggested Teaching/Learning Activities (e.g., Lecture, Group Discussion, Lab work)."
          },
          synchronous: {
            type: Type.STRING,
            description: "Synchronous teaching tools and actions (e.g., Live lecture on Google Meet, Interactive Q&A sessions)."
          },
          asynchronous: {
            type: Type.STRING,
            description: "Asynchronous teaching tools and actions (e.g., Recorded lectures, Discussion board posts, Self-guided modules)."
          },
          ltsm: {
            type: Type.STRING,
            description: "Learning and Teaching Support Materials (e.g., Textbook Chapter, Online Articles, Video)."
          },
          outputMaterials: {
            type: Type.STRING,
            description: "Tangible materials students will produce (e.g., Code, Essay, Presentation slides)."
          },
        },
      },
    },
    references: {
      type: Type.ARRAY,
      description: "A list of at least 5 relevant scholarly journal articles for extended reading. Each reference must include a working hyperlink.",
      items: {
        type: Type.OBJECT,
        required: ["title", "authors", "year", "journal", "url"],
        properties: {
          title: { type: Type.STRING, description: "The full title of the article." },
          authors: { type: Type.STRING, description: "The author(s) of the article." },
          year: { type: Type.INTEGER, description: "The publication year." },
          journal: { type: Type.STRING, description: "The name of the journal or publication." },
          url: { type: Type.STRING, description: "A working hyperlink to access or preview the article (e.g., Google Scholar, JSTOR)." }
        }
      }
    },
  },
  required: ["pilos", "syllabus", "references"],
};

export const generateSyllabus = async (
  subjectTitle: string,
  courseDescription: string,
  numWeeks: number
): Promise<SyllabusData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert curriculum designer and university professor. Your task is to generate a comprehensive subject syllabus based on user-provided details. Provide the output in a structured JSON format that adheres to the provided schema.

    Generate a complete syllabus for a course with the following details:
    - Subject Title: "${subjectTitle}"
    - Course Description: "${courseDescription}"
    - Number of Weeks: ${numWeeks}

    The syllabus must include:
    1.  A list of 3-5 Program Intended Learning Outcomes (PILOs).
    2.  A detailed weekly breakdown for all ${numWeeks} weeks. The week numbers in the syllabus array must be sequential and start from 1.
    3.  A list of at least 5 relevant scholarly journal articles for extended reading. For each article, provide the title, authors, year, journal name, and a working hyperlink to a site like Google Scholar, JSTOR, or the publisher's website. These references should be highly relevant to the course description.

    For each week, provide the specified details: content, ILO, ATs, TLAs, LTSM, and output materials. For the methodology, detail the specific teaching tools and actions for both categories:
    - Synchronous: Real-time activities. Examples: "Live lecture via Google Meet", "Interactive Q&A session", "Breakout group discussions on Zoom".
    - Asynchronous: Self-paced activities. Examples: "Watch recorded lecture", "Post on LMS discussion board", "Complete self-guided module", "Quiz activity".
    
    Be concise but informative in all fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: syllabusSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData: SyllabusData = JSON.parse(jsonString);

    if (parsedData.syllabus) {
        parsedData.syllabus.sort((a, b) => a.week - b.week);
    }

    return parsedData;

  } catch (error) {
    console.error("Error generating syllabus with Gemini:", error);
    throw new Error("Failed to communicate with the AI model. Please check the console for more details.");
  }
};


// --- File Parsing Service ---

const parsedSyllabusSchema = {
  type: Type.OBJECT,
  properties: {
    subjectTitle: { type: Type.STRING, description: "The extracted subject title. If not found, infer from content." },
    courseDescription: { type: Type.STRING, description: "The extracted course description. If not found, summarize the content." },
    numWeeks: { type: Type.INTEGER, description: "The total number of weeks found in the syllabus. If not explicitly stated, count the weekly entries." },
    pilos: syllabusSchema.properties.pilos,
    syllabus: syllabusSchema.properties.syllabus,
    references: syllabusSchema.properties.references,
  },
  required: ["subjectTitle", "courseDescription", "numWeeks", "pilos", "syllabus"],
};

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file as base64 string.'));
        }
    };
    reader.onerror = error => reject(error);
});

export const parseSyllabusFromFile = async (file: File): Promise<ParsedSyllabusResponse> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64File = await toBase64(file);

    const filePart = {
        inlineData: {
            mimeType: file.type,
            data: base64File,
        },
    };

    const prompt = `
        You are an intelligent document parser specializing in academic syllabi. Your task is to analyze the provided syllabus file (.pdf, .docx, or .txt) and extract its contents into a structured JSON format according to the provided schema.

        Key instructions:
        - Extract the course title, description, and total number of weeks.
        - If the number of weeks isn't explicitly mentioned, infer it from the number of weekly sections.
        - Extract the Program Intended Learning Outcomes (PILOs).
        - For each week, extract all available details: content/topics, Intended Learning Outcomes (ILOs), Assessment Tasks (ATs), Teaching/Learning Activities (TLAs), synchronous and asynchronous methodologies, Learning and Teaching Support Materials (LTSM), and any output materials.
        - Extract any list of references or extended readings. Each reference should include title, authors, year, journal, and a URL if available. If a URL is not present, attempt to find one on Google Scholar or leave it empty.
        - If any sections or details are missing in the document for a particular week or field, use an empty string "" or an empty array [] for the corresponding JSON field. Do not make up information.
        - Ensure the output strictly adheres to the JSON schema.
    `;
    
    const promptPart = { text: prompt };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [promptPart, filePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: parsedSyllabusSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedData: ParsedSyllabusResponse = JSON.parse(jsonString);

        if (parsedData.syllabus) {
            parsedData.syllabus.sort((a, b) => a.week - b.week);
        }

        return parsedData;

    } catch (error) {
        console.error("Error parsing syllabus with Gemini:", error);
        throw new Error("Failed to communicate with the AI model to parse the file. The file might be unsupported or corrupted.");
    }
};
