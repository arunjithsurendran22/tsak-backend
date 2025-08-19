class BannerEntity {
    public documentStatus: boolean;
    public offerTitle: string;
    public title: string;
    public description: string;
    public images: string[];
    public buttonTitle: string;
    public createdUser: string | null;
    public createdAt: Date | null;
    public updatedUser: string | null;
    public updatedAt: Date | null;
  
    constructor(
      documentStatus: boolean,
      offerTitle: string,
      title: string,
      description: string,
      images: string[],
      buttonTitle: string,
      createdUser: string | null,
      createdAt: Date | null,
      updatedUser: string | null,
      updatedAt: Date | null,
    ) {
      this.documentStatus = documentStatus;
      this.offerTitle = offerTitle;
      this.title = title;
      this.description = description;
      this.images = images;
      this.buttonTitle = buttonTitle;
      this.createdUser = createdUser;
      this.createdAt = createdAt;
      this.updatedUser = updatedUser;
      this.updatedAt = updatedAt;
    }
  }
  
  export default BannerEntity;
  