-- Tambahkan kode produk unik yang dapat dibuat otomatis atau diisi manual.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_code text;

CREATE SEQUENCE IF NOT EXISTS public.product_code_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_product_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  candidate text;
BEGIN
  LOOP
    candidate := 'LU-' || lpad(nextval('public.product_code_seq')::text, 4, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.products
      WHERE lower(product_code) = lower(candidate)
    );
  END LOOP;

  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_product_code() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_product_code() TO authenticated, service_role;

UPDATE public.products
SET product_code = public.generate_product_code()
WHERE product_code IS NULL OR btrim(product_code) = '';

CREATE OR REPLACE FUNCTION public.normalize_product_code()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.product_code IS NULL OR btrim(NEW.product_code) = '' THEN
    NEW.product_code := public.generate_product_code();
  ELSE
    NEW.product_code := upper(btrim(NEW.product_code));
  END IF;

  IF NEW.product_code !~ '^[A-Z0-9][A-Z0-9-]{1,39}$' THEN
    RAISE EXCEPTION 'Kode produk hanya boleh berisi huruf, angka, dan tanda hubung (2-40 karakter).';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_products_product_code ON public.products;
CREATE TRIGGER normalize_products_product_code
BEFORE INSERT OR UPDATE OF product_code ON public.products
FOR EACH ROW EXECUTE FUNCTION public.normalize_product_code();

ALTER TABLE public.products
  ALTER COLUMN product_code SET DEFAULT public.generate_product_code(),
  ALTER COLUMN product_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS products_product_code_lower_unique
  ON public.products (lower(product_code));

CREATE INDEX IF NOT EXISTS idx_products_product_code
  ON public.products (product_code);
