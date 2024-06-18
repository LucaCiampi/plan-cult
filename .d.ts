declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.mp3';
declare module '*.m4a';
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
