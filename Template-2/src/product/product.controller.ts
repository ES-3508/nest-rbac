import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guard/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guard/role.guard";

@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  @Roles(Role.Admin) 
  @UseGuards(JwtGuard, RolesGuard) // Apply JwtGuard before RolesGuard
  // Specify the role(s) allowed to access this route
  async findAll() {
    try {
      const allProducts = await this.productService.findAll();
      return { success: true, data: allProducts};
    } catch (error) {
      return { success: false, message: error.message };
    }
  }


  @UseGuards(JwtGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const product = await this.productService.findOne(id);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const product = await this.productService.update(id, updateProductDto);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      const product = await this.productService.remove(id);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
