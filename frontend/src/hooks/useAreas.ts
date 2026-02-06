import { useQuery } from "@tanstack/react-query";
import { getAreas } from "../api/areas";

export function useAreas() {
    return useQuery({
        queryKey: ['areas'],
        queryFn: getAreas
    })
}