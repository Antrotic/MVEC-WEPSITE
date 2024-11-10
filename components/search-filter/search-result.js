import React from 'react';
import { useTranslation } from 'react-i18next';
import RiveResult from '../loader/rive-result';
import Search2LineIcon from 'remixicon-react/Search2LineIcon';
import Link from 'next/link';

const SearchResult = ({ isSearching, searchResult, setVisible }) => {
  const { t: tl } = useTranslation();

  const onClick = () => {
    setVisible(false);
  };

  console.log('=====searchResult====');
  console.log(searchResult);

  return (
    <div className="search-result-wrapper">
      {isSearching ? (
        `${tl('searching')}...`
      ) : !searchResult?.data?.length ? (
        <RiveResult />
      ) : (
        <div className="suggestion">
          <ul>
            {searchResult?.data?.map((suggestion, key) => (
              <li key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr' }}>
                <Link href={`/product/${suggestion.product.slug}`}>
                  <a onClick={onClick} style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    {suggestion.product.img && (
                      <img
                        src={suggestion.product.img} // رابط الصورة
                        alt={suggestion.product.translation?.title}
                        style={{ width: '40px', height: '40px', marginRight: '10px' }} // تنسيق الصورة
                      />
                    )}
                    <span style={{ flexGrow: 1, textAlign: 'right' }}> {/* إضافة flexGrow لجعل الاسم على اليمين */}
                      {suggestion.product.translation?.title}
                    </span>
                  </a>
                </Link>
                <Search2LineIcon size={20} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
