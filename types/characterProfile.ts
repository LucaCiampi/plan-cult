type CharacterProfileSection =
  | PhotoProfileSection
  | TextPromptProfileSection
  | AudioPromptProfileSection;

interface CharacterProfileSectionBase {
  id: number;
  __component: 'profile.photo' | 'profile.text-prompt' | 'profile.audio-prompt';
  profile_prompt_title?: {
    data: {
      attributes: Title;
    };
  };
}

interface PhotoProfileSection extends CharacterProfileSectionBase {
  __component: 'profile.photo';
  image?: {
    data: ImageAttributes;
  };
}

interface TextPromptProfileSection extends CharacterProfileSectionBase {
  __component: 'profile.text-prompt';
  answer: Answer[];
}

interface AudioPromptProfileSection extends CharacterProfileSectionBase {
  __component: 'profile.audio-prompt';
}

interface ImageAttributes {
  id: number;
  attributes: {
    alternativeText: string | null;
    caption: string | null;
    formats: Formats;
    name: string;
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
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
  path: string | null;
  name: string;
  hash: string;
  ext: string;
  mime: string;
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
