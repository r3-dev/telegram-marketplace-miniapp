import { ProductsResponse } from "@/types/pb-types";
import { ListResult } from "pocketbase";
import { Accessor, Resource, createMemo } from "solid-js";

function toListResult<T>(item: ListResult<T> | undefined): ListResult<T> {
    return item ? item : {
        page: 0,
        perPage: 0,
        totalItems: 0,
        totalPages: 0,
        items: [],
    }
}

export function createAggListResult<T>(res: Resource<ListResult<T>>, initialValue?: ListResult<T>): Accessor<ListResult<T>> {
    return createMemo((previous) => {
        const current = res.latest;
        const prevResult = toListResult(previous)

        if (!current) return prevResult
        if (current.page === 1)
            return current

        return { ...current, items: [...prevResult.items, ...current.items] }
    }, initialValue)
}