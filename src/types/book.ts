export type BookFormat = "PHYSICAL" | "DIGITAL";
export type BookAvailability = "Available" | "On Loan";
export type DigitalFileFormat = "PDF" | "EPUB";

export type Book = {
  id: string | number;
  title: string;
  author: string;
  rating: number;
  year: number;
  format: BookFormat;
  availability: BookAvailability;
  image: string;
  genre: string;
  fileId?: string;
  digitalFormat?: DigitalFileFormat;
  sizeLabel?: string;
};
