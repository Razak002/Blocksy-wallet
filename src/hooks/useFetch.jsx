import { useState, useEffect, useRef } from "react";


const API_KEY = import.meta.env.VITE_GIPHY_API || "dc6zaTOxFJmzC";

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");
  const cache = useRef({}); 

  useEffect(() => {
    if (!keyword) return;

    const fetchGifs = async () => {
      if (cache.current[keyword]) {
        setGifUrl(cache.current[keyword]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        if (data.length > 0) {
          const gif = data[0]?.images?.downsized_medium?.url;
          cache.current[keyword] = gif;  
          setGifUrl(gif);
        } else {
          setGifUrl("https://media.giphy.com/media/uLnPIWsqIz2aA/giphy.gif");
        }
      } catch (error) {
        console.error("GIF Fetch Error:", error.message);
        setGifUrl("https://media.giphy.com/media/uLnPIWsqIz2aA/giphy.gif");
      }
    };

    fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
