package com.campus.backend.moduleb.bookingmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectBookingRequest {

    @NotBlank(message = "A rejection reason is required")
    private String reason;
}
