import axios from 'axios';

interface Preferences {
    genre: string;
    inspiration: string;
    storyTone: string;
    imagery: string;
    perspective: string;
    language: string;
}

export async function generateLyrics(preferences: Preferences) {
    const prompt = `
    Here are some questions and their respective answers for generating lyrics:
    1. What is your favorite genre? ${preferences.genre}
    2. Who or what inspires these lyrics (person, place, memory, or emotion)? ${preferences.inspiration}
    3. Should the story behind the lyrics be happy, bittersweet, motivational, or romantic? ${preferences.storyTone}
    4. What imagery or metaphors do you want included (e.g., stars, oceans, roads, seasons)? ${preferences.imagery}
    5. What perspective should the lyrics be from (first-person, third-person, or conversational)? ${preferences.perspective}
    6. Generate the lyrics in ${preferences.language}.

    The lyrics should be within 90 words and it should be complete.
  `;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 300,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }

            }
        );

        return response.data.choices[0]?.message?.content.trim() || "No lyrics generated.";
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error generating lyrics:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error generating lyrics:', error);
        }
        return "Sorry, we couldn't generate lyrics at this time.";
    }
}
