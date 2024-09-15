import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { FindOptionsOrder, ILike } from "typeorm";

function ILikeConvertor(data){
    Object.keys(data).forEach(k => {
        if(data[k] || data[k] == ''){
            if(typeof data[k] == 'object') ILikeConvertor(data[k]);
            else data[k] = ILike(data[k] + "%");
        }
    })
    return data
}

export class PaginationQueryDto{
    @IsOptional()
    skip: number;

    @IsOptional()
    take: number;
    
    @IsOptional()
    sort?: FindOptionsOrder<any>
    
    @IsOptional() @Transform((data) => ILikeConvertor(JSON.parse(decodeURIComponent(data.value))))
    searchQuery: any;
    
    @IsOptional() @Transform((data) => JSON.parse(decodeURIComponent(data.value)))
    extra?: any;
}