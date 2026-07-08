import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, Button } from '@wordpress/components';

const CustomAttributesControl = ({ value, onChange }) => {
  const customAttributes = Array.isArray(value) ? value : [];

  const updateAttribute = (index, key, newValue) => {
    const updated = customAttributes.map((attr, i) =>
      i === index ? { ...attr, [key]: newValue } : attr
    );
    onChange(updated);
  };

  const removeAttribute = (index) => {
    onChange(customAttributes.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    onChange([...customAttributes, { name: '', value: '' }]);
  };

  return (
    <PanelBody title={__('Custom HTML Attributes', 'ekwa-wufoo-form-builder')} initialOpen={false}>
      <p style={{ fontSize: '12px', color: '#757575', marginTop: 0 }}>
        {__('Pass-through HTML attributes (data-*, aria-*, role, title, tabindex, lang, dir, autocomplete, etc.).', 'ekwa-wufoo-form-builder')}
      </p>
      {customAttributes.map((attr, index) => (
        <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '8px' }}>
          <TextControl
            label={__('Name', 'ekwa-wufoo-form-builder')}
            value={attr.name || ''}
            onChange={(newValue) => updateAttribute(index, 'name', newValue)}
            __nextHasNoMarginBottom
            style={{ flex: 1 }}
          />
          <TextControl
            label={__('Value', 'ekwa-wufoo-form-builder')}
            value={attr.value || ''}
            onChange={(newValue) => updateAttribute(index, 'value', newValue)}
            __nextHasNoMarginBottom
            style={{ flex: 1 }}
          />
          <Button
            isDestructive
            icon="no-alt"
            label={__('Remove attribute', 'ekwa-wufoo-form-builder')}
            onClick={() => removeAttribute(index)}
          />
        </div>
      ))}
      <Button variant="secondary" onClick={addAttribute}>
        {__('+ Add Attribute', 'ekwa-wufoo-form-builder')}
      </Button>
    </PanelBody>
  );
};

export default CustomAttributesControl;
