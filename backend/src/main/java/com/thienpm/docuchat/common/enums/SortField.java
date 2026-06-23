package com.thienpm.docuchat.common.enums;

public enum SortField {
    CREATED_AT("createdAt");

    private final String field;

    SortField(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
