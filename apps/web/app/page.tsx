import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <main>
      <ThemeImage
        srcLight="turborepo-dark.svg"
        srcDark="turborepo-light.svg"
        alt="Turborepo logo"
        width={180}
        height={38}
        priority
      />
    </main>
  );
}
