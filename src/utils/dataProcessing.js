export function processData(records) {
  return records.map((r) => {
    console.log("abstract_s raw:", r["abstract_s"]);
    const tipo = (r["document_type"] || "").trim();
    const idioma = (r["language"] || "").trim().toLowerCase();
    const direitos = (r["rights"] || "").trim().toLowerCase();
    const pdfDownloadedRaw = String(r["pdf_downloaded"] || "").trim().toLowerCase();

    const tipoLabel =
      tipo === "master thesis"
        ? "Dissertação de mestrado"
        : tipo === "doctoral thesis"
        ? "Tese de doutoramento"
        : r["document_type"] || "";

    const idiomaLabel =
      idioma === "por"
        ? "Português"
        : idioma === "eng"
        ? "Inglês"
        : r["language"] || "";

    const direitosLabel =
      direitos === "open access"
        ? "Acesso aberto"
        : direitos === "embargoed access"
        ? "Acesso embargado"
        : r["rights"] || "";

    return {
      id: r["internal_id"] || "",

      titulo: r["title"] || "",
      autor: r["author"] || "",
      orientador: (r["contributor"] || "")
        .replace(/\s*\|\s*/g, "; ")
        .trim(),

      ano: Number(r["year"]) || "",
      tipo,
      tipo_label: tipoLabel,
      grau: r["degree_level"] || "",
      idioma,
      idioma_label: idiomaLabel,

      resumo: r["abstract"] || "",
      abstract_s: r["abstract_s"] || r["abstract_s"] || "",
      palavra_chave: (r["keywords"] || "")
        .replace(/\s*\|\s*/g, "; ")
        .trim(),

      subject: r["subject"]?.trim() || "",

      // 🔗 links (normalizados)
      record_url: r["record_url"] || "",
      url: r["url"] || "",
      landing_page_url: r["landing_page_url"] || "",
      pdf_url: r["pdf_url"] || "",

      // 👉 link principal para usar no UI
      link:
        r["url"] ||
        r["record_url"] ||
        r["landing_page_url"] ||
        "",

      // 🎯 temas
      subject_label: r["subject_label"]?.trim() || "",

      // múltiplos temas (mantém string, vais tratar com split no componente)
      subjects: r["subjects"]?.trim() || "",

      repositorio: r["origin_repository"] || "",
      repositorio_url: r["origin_repository_url"] || "",

      instituicao: r["institution_normalized"] || "",
      instituicao_abreviada: r["institution_abbreviation"] || "",

      direitos: r["rights"] || "",
      direitos_label: direitosLabel,

      total_hits: Number(r["search_hit_count"]) || 0,

      pdf_downloaded: pdfDownloadedRaw === "true",
      pdf_page_count: Number(r["pdf_page_count"]) || 0,
      pdf_text_char_count: Number(r["pdf_text_char_count"]) || 0,

      manual_review_status: r["manual_review_status"] || "",

      descritor_primario: r["primary_category"] || "",
      descritor_primario_label: r["primary_category_label"] || "",
      descritores: r["categories"] || "",
      descritores_label: (r["category_labels"] || "")
        .replace(/\s*\|\s*/g, "; ")
        .trim(),
      regras_descritores: r["category_rule_matches"] || "",
    };
  });
}