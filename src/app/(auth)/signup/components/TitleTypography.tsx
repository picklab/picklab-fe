import Typography from '@/components/common/Typography';

interface TitleTypographyProps {
  title: string;
  description: string;
}

export default function TitleTypography({ title, description }: TitleTypographyProps) {
  return (
    <>
      <div className="flex flex-col gap-2 items-center text-center sm:block xl:hidden">
        <Typography tag="h1" type="Title2Bold" id="signup-title" className="break-keep">
          {title}
        </Typography>
        <Typography tag="p" type="Body2Medium" id="signup-description">
          {description}
        </Typography>
      </div>
      <div className="flex flex-col gap-1 items-center justify-center text-center sm:hidden xl:block">
        <Typography tag="h1" type="Heading2Bold" id="signup-title">
          {title}
        </Typography>
        <Typography tag="p" type="Body3Medium" id="signup-description">
          {description}
        </Typography>
      </div>
    </>
  );
}
