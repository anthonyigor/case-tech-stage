import { useQuery } from "@tanstack/react-query";
import { getPeople } from "../api/people";

export function usePeople() {
    return useQuery({
        queryFn: getPeople,
        queryKey: ['people']
    })
}