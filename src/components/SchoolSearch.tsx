import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "phosphor-react";
import { searchSchools, School } from "@/data/ontarioSchools";

const SchoolSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchSchools(query);
      setResults(searchResults);
      setIsOpen(true); // Always show dropdown when there's a query
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectSchool = (school: School) => {
    navigate(`/${school.slug}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50" ref={dropdownRef} style={{ pointerEvents: 'auto' }}>
      <div className="relative">
        <MagnifyingGlass
          size={24}
          weight="light"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none z-10"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for your Ontario high school..."
          className="w-full bg-background/80 backdrop-blur-sm border-2 border-border/50 rounded-2xl pl-14 pr-6 py-4 text-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg relative z-20"
          style={{ pointerEvents: 'auto' }}
        />
      </div>

      {isOpen && query.trim() && (
        <>
          {results.length > 0 ? (
            <div className="absolute z-[100] w-full mt-2 glass border-2 border-border rounded-2xl shadow-2xl max-h-96 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
              {results.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelectSchool(school)}
                  className="w-full text-left px-6 py-4 hover:bg-primary/20 transition-colors border-b border-border/50 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer"
                  type="button"
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="font-semibold text-foreground">{school.name}</div>
                  <div className="text-sm text-foreground/60">{school.city}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="absolute z-[100] w-full mt-2 glass border-2 border-border rounded-2xl shadow-2xl p-6 text-center text-foreground/60" style={{ pointerEvents: 'auto' }}>
              No schools found for "{query}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolSearch;

