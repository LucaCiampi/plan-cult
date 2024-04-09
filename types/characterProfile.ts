interface CharacterProfile {
  id: number;
  __component: 'profile.photo' | 'profile.text-prompt' | 'profile.audio-prompt';
  profile_prompt_title?: {
    data: {
      attributes: Title;
    };
  };
}

interface PhotoProfileSection extends CharacterProfile {
  __component: 'profile.photo';
  image?: {
    data: ImageAttributes;
  };
}

interface TextPromptProfileSection extends CharacterProfile {
  __component: 'profile.text-prompt';
  answer: Answer[];
}

interface AudioPromptProfileSection extends CharacterProfile {
  __component: 'profile.audio-prompt';
}

type CharacterProfileSection =
  | PhotoProfileSection
  | TextPromptProfileSection
  | AudioPromptProfileSection;

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
