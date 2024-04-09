interface CharacterProfile {
  id: number;
  __component: 'profile.photo' | 'profile.text-prompt' | 'profile.audio-prompt';
  image?: {
    data: ImageAttributes;
  };
  profile_prompt_title?: {
    data: {
      attributes: Title;
    };
  };
  answer?: Answer[];
}

interface ImageAttributes {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: Formats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
  };
}

interface Formats {
  thumbnail?: ImageFormat;
  small?: ImageFormat;
}

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface Title {
  createdAt: string;
  updatedAt: string;
  title: string;
}

interface Answer {
  type: string;
  format: string;
  children: AnswerChild[];
}

interface AnswerChild {
  type: string;
  children: TextChild[];
}

interface TextChild {
  type: string;
  text: string;
}
