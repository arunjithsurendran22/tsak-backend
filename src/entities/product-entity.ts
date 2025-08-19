class ProductEntity {
    public documentStatus: boolean;
    public name: string;
    public description: string;
    public price: number;
    public images: string[];
    public stock: number;
    public createdUser: string | null;
    public createdAt: Date | null;
    public updatedUser: string | null;
    public updatedAt: Date | null;
  
    constructor(
      documentStatus: boolean,
      name: string,
      description: string,
      price: number,
      images: string[],
      stock: number,
      createdUser: string | null,
      createdAt: Date | null,
      updatedUser: string | null,
      updatedAt: Date | null,
    ) {
      this.documentStatus = documentStatus;
      this.name = name;
      this.description = description;
      this.price = price;
      this.images = images;
      this.stock = stock;
      this.createdUser = createdUser;
      this.createdAt = createdAt;
      this.updatedUser = updatedUser;
      this.updatedAt = updatedAt;
    }
  }
  
  export default ProductEntity;
  