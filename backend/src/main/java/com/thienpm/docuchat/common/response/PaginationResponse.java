package com.thienpm.docuchat.common.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class PaginationResponse<T> {
    private List<T> data;
    private int totalPages;
    private Long totalElements;
    private int page;
    private int size;
}
