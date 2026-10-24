import React from 'react';
import { ThreeSceneBanner } from './3d/ThreeSceneBanner';

export const FullWidthBanner: React.FC = () => {
  return (
    <ThreeSceneBanner
      tag="ঢাকা ও আশেপাশের প্রতিটি এলাকায় ৩ডি কভারেজ"
      titlePrimary="আপনি যেখানে,"
      titleSecondary="আমরা সেখানেই।"
      subtitle="আপনার মূল্যবান সময় বাঁচানোই আমাদের সার্বক্ষণিক ৩ডি দায়িত্ব।"
    />
  );
};
