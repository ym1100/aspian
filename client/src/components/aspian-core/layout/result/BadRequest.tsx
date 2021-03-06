import React from 'react';
import { Result, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const BadRequest = () => {
  const { t } = useTranslation('core_badRequestPage');
  return (
    <Result
      status="404"
      title={t('title')}
      subTitle={t('subtitle')}
      extra={
        <Button type="primary" href="/admin">
          {t('button')}
        </Button>
      }
    />
  );
};

export default BadRequest;
