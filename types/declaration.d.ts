declare module "*.css" {
  const styles: { [key: string]: string }
  export = styles
}

declare module "*.jpg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}

declare module "protvista-uniprot" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}
