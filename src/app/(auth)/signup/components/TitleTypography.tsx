import Typography from '@/components/common/Typography';

interface TitleTypographyProps {
  title: string;
  description: string;
}

export default function TitleTypography({ title, description }: TitleTypographyProps) {
  return (
    <>
      <div className="flex flex-col gap-2 items-center text-center pc:hidden">
        <Typography tag="h1" type="Title2Bold" id="signup-title" className="break-keep">
          {title}
        </Typography>
        <Typography tag="p" type="Body2Medium" id="signup-description" className="text-gray-50">
          {description}
        </Typography>
      </div>
      <div className="mobile:hidden pc:flex flex-col gap-2 items-center justify-center text-center">
        <Typography tag="h1" type="Heading2Bold" id="signup-title">
          {title}
        </Typography>
        <Typography tag="p" type="Body3Medium" id="signup-description" className="text-gray-50">
          {description}
        </Typography>
      </div>
    </>
  );
}
