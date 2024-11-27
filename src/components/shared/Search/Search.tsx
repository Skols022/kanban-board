import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { searchTerm } from '@/features/kanban/kanbanSlice';
import SearchIcon from '@/assets/icons/search.svg?react';
import styles from './Search.module.css';

const Search: FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

  const toggleSearchInput = () => {
    setIsInputVisible((prev) => !prev);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchTerm(event.target.value));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsInputVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.search}>
      <Input
        ref={inputRef}
        isTextArea={false}
        placeholder='Search tasks...'
        onChange={handleSearch}
        className={`${styles.searchInput} ${isInputVisible ? styles.visible : ''}`}
      />
      {!isInputVisible && <Button className={styles.searchButton} onClick={toggleSearchInput}>
        <SearchIcon />
      </Button>}
    </div>
  );
};

export default Search;
