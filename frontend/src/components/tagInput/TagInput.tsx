import React, { useState } from "react";
import "./tag-input.scss";
import type { TagInputProps } from "../../models/components";

const TagInput: React.FC<TagInputProps> = ({ label, selectedTags, onChange }) => {
    
    const [input, setInput] = useState("");
    const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            e.preventDefault();
            const newTag = input.trim();
            if (!selectedTags.includes(newTag)) {
                onChange([...selectedTags, newTag]);
            }
            setInput("");
        }
    };

    const removeTag = (tag: string) => {
        onChange(selectedTags.filter(t => t !== tag));
    };

    return (
        <div className="tag-input">
            <label className="tag-input__label">{label}</label>
            <div className="tag-input__tags">
                {selectedTags.map(tag => (
                    <span key={tag} className="tag-input__tag">
                        {tag}
                        <button
                            type="button"
                            className="tag-input__remove"
                            onClick={() => removeTag(tag)}
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                className="tag-input__field"
                placeholder="Type and press Enter..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleAdd}
            />

        </div>
    );
};

export default TagInput;
