using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindingTheSquad.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToLfgSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "LfgSessions",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_LfgSessions_UserId",
                table: "LfgSessions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LfgSessions_UserId",
                table: "LfgSessions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LfgSessions");
        }
    }
}

