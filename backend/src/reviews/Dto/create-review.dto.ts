import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsMongoId()
    @IsNotEmpty()

    doctor!: string


    @IsMongoId()
    @IsNotEmpty()
    appointment!: string;


    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating!: number

    @IsString()
    @IsOptional()
    comment?: string
}