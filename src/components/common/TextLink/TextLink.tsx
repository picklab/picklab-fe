import Typography from '@/components/common/Typography';
import Link from 'next/link';
import React from 'react';

interface TextLinkProps {
  text: string;
  href: string;
}

const TextLink = ({ text, href }: TextLinkProps) => {
  return (
    <Link
      href={href}
      className="w-fit text-gray-50 py-space-2 border-b border-gray-40 hover:text-gray-60 hover:border-gray-50 active:text-gray-70 active:border-gray-60"
    >
      <Typography type="Body3Medium">{text}</Typography>
    </Link>
  );
};

export default TextLink;
