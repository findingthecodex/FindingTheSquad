using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindingTheSquad.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConsoleFieldToLfgSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Console",
                table: "LfgSessions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Console",
                table: "LfgSessions");
        }
    }
}

