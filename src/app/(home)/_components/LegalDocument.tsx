import Typography from '@/components/common/Typography';
import type { LegalBlock, LegalDoc } from '@/constants/legal';

function BlockView({ block, compact = false }: { block: LegalBlock; compact?: boolean }) {
  // page: 본문 12px/400(Caption1Regular)·gray-90 / embed(회원가입 아코디언): 기존 유지
  const textType = compact ? 'Body4Regular' : 'Caption1Regular';
  const textColor = compact ? 'text-gray-70' : 'text-gray-90';

  if (block.kind === 'text') {
    return (
      <Typography tag="p" type={textType} className={`${textColor} whitespace-pre-line break-keep`}>
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
              <Typography tag="p" type={textType} className={`${textColor} break-keep`}>
                {`${index + 1}. ${text}`}
              </Typography>
              {sub && (
                <ul className="flex flex-col gap-1 pl-4">
                  {sub.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Typography tag="p" type={textType} className={`${textColor} break-keep`}>
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
          <Typography tag="p" type={textType} className={`${textColor} break-keep`}>
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
      {/* 페이지 제목: 24px/700 */}
      {!isEmbed && (
        <Typography tag="h1" type="Title3Bold" className="text-gray-90">
          {doc.title}
        </Typography>
      )}
      {/* 부제: page 13px/500 gray-90 / embed 기존 */}
      <Typography
        tag="p"
        type={isEmbed ? 'Body4Regular' : 'Body4Medium'}
        className={`${isEmbed ? 'text-gray-60' : 'mt-3 text-gray-90'} whitespace-pre-line break-keep`}
      >
        {doc.intro}
      </Typography>

      <div className={`h-px w-full bg-gray-20 ${isEmbed ? 'my-4' : 'my-8'}`} />

      <div className={`flex flex-col ${isEmbed ? 'gap-5' : 'gap-9'}`}>
        {doc.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            {/* 섹션 제목: page 16px/600 / embed 기존, 둘 다 gray-90 */}
            <Typography
              tag="h2"
              type={isEmbed ? 'Body2Medium' : 'Body1Semibold'}
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
