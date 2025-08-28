<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <title>Book Information</title>
        <link rel="stylesheet" type="text/css" href="styles.css"/>
      </head>
      <body>
        <h1>Book Collection</h1>
        <table class="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author Name</th>
              <th>ISBN Number</th>
              <th>Publisher Name</th>
              <th>Edition</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="bookstore/book">
              <tr>
                <td class="title-col"><xsl:value-of select="title"/></td>
                <td class="author-col"><xsl:value-of select="author"/></td>
                <td class="isbn-col"><xsl:value-of select="isbn"/></td>
                <td class="publisher-col"><xsl:value-of select="publisher"/></td>
                <td class="edition-col"><xsl:value-of select="edition"/></td>
                <td class="price-col"><xsl:value-of select="price"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>