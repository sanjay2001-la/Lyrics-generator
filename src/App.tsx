import React, { useState, useRef } from 'react';
import { Music2, Mic2, Send, PlayCircle, PauseCircle, Loader2, XCircle } from 'lucide-react';

import Jazz from './assets/Jazz.wav';
import rock from "./assets/rock.wav";
import sad from "./assets/sad.wav";
import Happy from "./assets/Happy.wav";
import Pop_up from "./assets/Pop up.wav";
import Country from "./assets/Country.wav";
import { generateLyrics } from './generateLyrics';

const audioTracks = [
  { name: "Pop Up", file: Pop_up },
  { name: "Jazz", file: Jazz },
  { name: "Rock", file: rock },
  { name: "Sad", file: sad },
  { name: "Happy", file: Happy },
  { name: "Country", file: Country },
];

const Form = () => {
  const [preferences, setPreferences] = useState({
    genre: "",
    inspiration: "",
    storyTone: "",
    imagery: "",
    perspective: "",
    language: "",
  });

  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedLyrics = await generateLyrics(preferences);
      setLyrics(generatedLyrics);
    } catch (error) {
      setLyrics("Error generating lyrics, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFormAndLyrics = () => {
    setPreferences({
      genre: "",
      inspiration: "",
      storyTone: "",
      imagery: "",
      perspective: "",
      language: "",
    });
    setLyrics("");
  };

  const playTrack = (trackFile: string) => {
    if (audioRef.current) {
      if (trackFile !== selectedTrack) {
        setSelectedTrack(trackFile);
        audioRef.current.src = trackFile;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        togglePlayPause();
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatLyrics = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-900 to-red-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-8">
          {/* Form Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Music2 className="w-14 h-6 text-red-400" />
                Let's create some personalized song lyrics!
              </h2>

              {Object.entries(preferences).map(([key, value], index) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    {index + 1}. {getQuestionForPreference(key as keyof typeof questions)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Type your answer here..."
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-red-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Lyrics
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Lyrics Section */}
          <div className="space-y-8">
            {!lyrics && !loading && (
              <div className="bg-white h-[750px] rounded-2xl p-8 shadow-xl flex items-center justify-center">
                <p className="text-gray-400 text-4xl">
                  Ready to craft your next lyrical masterpiece? Answer a few questions to personalize your lyrics!
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white h-[730px] rounded-2xl p-8 shadow-xl flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
              </div>
            )}

            {lyrics && (
              <div className="bg-white h-[650px] rounded-2xl p-8 shadow-xl flex space-x-8">
                <div className="flex-[2]">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-black">
                    <Mic2 className="w-6 h-6 text-red-400" />
                    Generated Lyrics
                  </h2>
                  <div className="prose prose-invert max-w-none mb-4 h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="whitespace-pre-line text-black leading-relaxed text-xl">
                      {formatLyrics(lyrics)}
                    </div>
                  </div>
                </div>

                <div className="flex-[1]">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
                    <PlayCircle className="w-6 h-6 text-black" />
                    Select a Beat
                  </h3>

                  <audio ref={audioRef} controls style={{ display: "none" }} />
                  <ul className="space-y-2 text-black">
                    {audioTracks.map((track) => (
                      <li
                        key={track.name}
                        className={`cursor-pointer flex justify-between items-center`}
                      >
                        <span onClick={() => playTrack(track.file)} className={`${selectedTrack === track.file ? "border-b-2 border-red-500" : ""}`}>
                          {track.name}
                        </span>
                        {selectedTrack === track.file && (
                          <button onClick={togglePlayPause}>
                            {isPlaying ? (
                              <PauseCircle className="w-6 h-6 text-red-400" />
                            ) : (
                              <PlayCircle className="w-6 h-6 text-green-400" />
                            )}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            )}

            {/* Clear Button */}
            {lyrics && (
              <button
                className="w-full py-2 mt-4 bg-red-500 rounded-lg text-white text-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-200"
                onClick={clearFormAndLyrics}
              >
                <XCircle className="w-5 h-5" />
                Clear Lyrics & Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const questions = {

    genre: "What is your favorite music genre?",
    inspiration: "Who or what inspires these lyrics—a person, place, memory, or emotion?",
    storyTone: "What tone should the story behind the lyrics have: happy, bittersweet, motivational, or romantic?",
    imagery: "What imagery or metaphors would you like to include (e.g., stars, oceans, roads, or seasons)?",
    perspective: "Which perspective should the lyrics be written from: first-person, third-person, or conversational?",
    language: "What language do you prefer for the lyrics?",
  };



function getQuestionForPreference(key: keyof typeof questions) {
  return questions[key] || key;
}

export default Form;
