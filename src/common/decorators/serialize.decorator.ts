import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { ClassConstructor } from '../interfaces/ClassConstructor.interface';

export const Serialize = (dto: ClassConstructor) => UseInterceptors(new SerializeInterceptor(dto));
