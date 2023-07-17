import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);

      return producto;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //TODO: Implementar paginación
  async findAll() {
    return await this.productRepository.find({});
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new BadRequestException(`Product with id ${id} not found`);

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    const product = this.productRepository.delete(id);

    if (!product)
      throw new BadRequestException(`Product with id ${id} not found`);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check Server logs',
    );
  }
}
