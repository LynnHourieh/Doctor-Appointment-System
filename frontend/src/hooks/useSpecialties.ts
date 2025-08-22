import { useEffect, useState } from "react";

export const useSpecialties = () => {
    const [specialties, setSpecialties] = useState<{ text: string; value: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/specialties`)
            .then(res => res.json())
            .then(data => {
                const options = data.map((s: any) => ({ text: s.name, value: s.id.toString() }));
                setSpecialties(options);
            })
            .finally(() => setLoading(false));
    }, []);

    return { specialties, loading };
};
