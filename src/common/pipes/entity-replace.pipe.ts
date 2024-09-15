import { EntityTarget } from 'typeorm';
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { Helper } from '../helpers';

export class EntityReplacePipe implements PipeTransform{

    entity: EntityTarget<unknown>;
    property: string;
    target: string;
    type: 'array' | 'property'

    constructor(config: {entity: EntityTarget<unknown>, property: string, target: string, type?: 'array' | 'property'}){
        const {entity, property, target} = config
        this.entity = entity;
        this.property = property;
        this.target = target;
        this.type = config.type ? config.type : 'property'
    }

    async transformProperty(propertyValue){
        const response = await Helper.dataSource.getRepository(this.entity).findOne({
            where: {
                [this.property]: propertyValue
            }
        })
        if(!response) throw new BadRequestException(
            `${this.entity.toString().split(' ')[1]} with ${this.property} '${propertyValue}' not found`
        )
        return response;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transform(value: any, _metadata: ArgumentMetadata) {
        if(value && value[this.target]){
            if(this.type == 'array'){
                for(let ind = 0; ind < value[this.target].length; ind++){
                    value[this.target][ind] = await this.transformProperty(value[this.target][ind])
                }
            }else value[this.target] = await this.transformProperty(value[this.target])
        }
        return value
    }

}