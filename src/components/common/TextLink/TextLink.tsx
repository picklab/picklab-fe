'use client';

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
      className="inline-flex w-fit items-center border-b border-gray-40 py-space-2 text-gray-50 hover:border-gray-50 hover:text-gray-60 active:border-gray-60 active:text-gray-70"
      aria-label={text}
    >
      <Typography tag="span" type="Body3Medium" className="text-inherit">
        {text}
      </Typography>
    </Link>
  );
};

export default TextLink;
