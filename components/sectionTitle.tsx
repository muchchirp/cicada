import React from "react";
import Container from '@/components/ui/Support/Container';

interface SectionTitleProps {
  align?: "left";
  pretitle?: string;
  title?: string;
  children?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = (props) => {
  return (
    <Container
      className={`flex w-full flex-col mt-4 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500${
        props.align === "left" ? "" : "items-center justify-center text-center"
      }`}
    >
      {props.pretitle && (
        <div className="text-sm font-bold tracking-wider text-indigo-600 uppercase">
          {props.pretitle}
        </div>
      )}

      {props.title && (
        <h2 className="max-w-2xl mt-3 text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-white">
          {props.title}
        </h2>
      )}

      {props.children && (
        <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
          {props.children}
        </p>
      )}



    </Container>

    
  );
};

export default SectionTitle;
