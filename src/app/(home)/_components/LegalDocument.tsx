import Typography from '@/components/common/Typography';
import type { LegalBlock, LegalDoc } from '@/constants/legal';

function BlockView({ block, compact = false }: { block: LegalBlock; compact?: boolean }) {
  const textType = compact ? 'Body4Regular' : 'Body2Regular';

  if (block.kind === 'text') {
    return (
      <Typography tag="p" type={textType} className="text-gray-70 whitespace-pre-line break-keep">
        {block.text}
      </Typography>
    );
  }

  if (block.kind === 'ordered') {
    return (
      <ol className="flex flex-col gap-2">
        {block.items.map((item, index) => {
          const text = typeof item === 'string' ? item : item.text;
          const sub = typeof item === 'string' ? undefined : item.sub;
          return (
            <li key={index} className="flex flex-col gap-1">
              <Typography tag="p" type={textType} className="text-gray-70 break-keep">
                {`${index + 1}. ${text}`}
              </Typography>
              {sub && (
                <ul className="flex flex-col gap-1 pl-4">
                  {sub.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Typography tag="p" type={textType} className="text-gray-70 break-keep">
                        {`• ${subItem}`}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {block.items.map((item, index) => (
        <li key={index}>
          <Typography tag="p" type={textType} className="text-gray-70 break-keep">
            {`• ${item}`}
          </Typography>
        </li>
      ))}
    </ul>
  );
}

interface LegalDocumentProps {
  doc: LegalDoc;
  /** 'page': 독립 페이지 / 'embed': 회원가입 아코디언 패널 내부(제목 생략·작은 폰트) */
  variant?: 'page' | 'embed';
}

export default function LegalDocument({ doc, variant = 'page' }: LegalDocumentProps) {
  const isEmbed = variant === 'embed';

  return (
    <div className={isEmbed ? '' : 'px-5 pc:px-0 pt-10 pb-20'}>
      {!isEmbed && (
        <Typography tag="h1" type="Title2Bold" className="text-gray-90">
          {doc.title}
        </Typography>
      )}
      <Typography
        tag="p"
        type={isEmbed ? 'Body4Regular' : 'Body2Regular'}
        className={`${isEmbed ? 'text-gray-60' : 'mt-3 text-gray-60'} whitespace-pre-line break-keep`}
      >
        {doc.intro}
      </Typography>

      <div className={`h-px w-full bg-gray-20 ${isEmbed ? 'my-4' : 'my-8'}`} />

      <div className={`flex flex-col ${isEmbed ? 'gap-5' : 'gap-9'}`}>
        {doc.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <Typography
              tag="h2"
              type={isEmbed ? 'Body2Medium' : 'Heading2Bold'}
              className="text-gray-90"
            >
              {section.heading}
            </Typography>
            {section.blocks.map((block, index) => (
              <BlockView key={index} block={block} compact={isEmbed} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
