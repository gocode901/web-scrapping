"use client";

import { scrapeAndStoreProduct } from "@/lib/action";
import { FormEvent, useState } from "react";
const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostName = parsedURL.hostname;
    return (
      hostName.includes("amazon.com") ||
      hostName.includes("amazon.") ||
      hostName.endsWith("amazon")
    );
  } catch (error) {
    return false;
  }
};
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidProductURL(searchTerm);
    if (!isValidLink) {
      return alert("Please enter a valid URL");
    }
    // alert(isValidLink ? "valid" : "invalid");
    // console.log(`Search term: ${searchTerm}`);
    setSearchTerm(""); // Clear input field after form submission
    try {
      setisLoading(true);

      //scrap the product page
      const product = await scrapeAndStoreProduct(searchTerm);
    } catch (error) {
      // console.error("Error searching for products:", { error });
      alert(
        "An error occurred while searching for products. Please try again."
      );
    } finally {
      setisLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleOnSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter Product Link..."
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchTerm === ""}
      >
        {isLoading ? "searching..." : "search"}
      </button>
    </form>
  );
};

export default SearchBar;
