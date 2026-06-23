package com.thienpm.docuchat.common.request;

import com.thienpm.docuchat.common.enums.SortDirection;
import com.thienpm.docuchat.common.enums.SortField;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaginationRequest {

    private String keyword;

    @Min(value = 0, message = "Page must be greater than or equal to 0")
    private int page = 0;

    @Min(value = 1, message = "Size must be greater than 0")
    @Max(value = 100, message = "Size must not exceed 100")
    private int size = 10;

    private SortField sortBy = SortField.CREATED_AT;

    private SortDirection sortDirection = SortDirection.DESC;
}